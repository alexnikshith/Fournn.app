const User = require('../models/User');
const AgentRun = require('../models/AgentRun');

class AgentEngine {
  /**
   * Safe execution pipeline:
   * PLAN -> EXPLAIN -> PERMISSION CHECK -> EXECUTE -> VERIFY -> LOG
   */
  static async runAgentStep({ userId, agentName, action, reason, inputContext, recommendation, executeFn }) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (user.emergencyPaused) {
      const runLog = await AgentRun.create({
        userId,
        agentName,
        action,
        reason,
        inputContext: inputContext || '',
        recommendation: `${recommendation} (BLOCKED: Emergency Agent Pause active)`,
        userApproved: false,
        executionStatus: 'paused',
        verificationDetails: 'Execution halted by user emergency switch.'
      });
      return { status: 'paused', message: 'Agents are currently paused by emergency switch.', runLog };
    }

    // Step 1 & 2: Plan & Explain logged
    const runLog = await AgentRun.create({
      userId,
      agentName,
      action,
      reason,
      inputContext: inputContext || '',
      recommendation,
      userApproved: false,
      executionStatus: 'waiting_permission',
      verificationDetails: 'Awaiting explicit user approval before execution.'
    });

    if (executeFn) {
      try {
        const executionResult = await executeFn();
        runLog.executionStatus = 'executed';
        runLog.userApproved = true;
        runLog.verificationDetails = executionResult.verificationMessage || 'Action executed and verified successfully.';
        await runLog.save();
        return { status: 'executed', result: executionResult, runLog };
      } catch (err) {
        runLog.executionStatus = 'failed';
        runLog.verificationDetails = `Execution failed: ${err.message}`;
        await runLog.save();
        throw err;
      }
    }

    return { status: 'waiting_permission', runLog };
  }
}

module.exports = AgentEngine;
