import type { VerifyIssuerDto } from "../dto/verify.dto.js";
import axios from "axios";
import cron from "node-cron";
import { IssuedDelivaryStatus } from "../enum/issued-status.js";
import { env } from "../env.js";
import logger from "../utils/logger.js";
import { getAssignmentByIssuedStatus, updateAssignmentByIssuedStatus } from "./assignment.service.js";

async function runScheduler() {
  logger.info("Running scheduled PATCH request...");

  const submittedAssignment = await getAssignmentByIssuedStatus([IssuedDelivaryStatus.PROCESSING, IssuedDelivaryStatus.SUBMITTED]);
  if (submittedAssignment && submittedAssignment.length > 0) {
    logger.info(`Scheduler ran for total: ${submittedAssignment.length} assignments`);
    await sendValidationRequest(submittedAssignment);
  }
}

runScheduler().catch(err => logger.error("Scheduler error on start:", err));

cron.schedule(`0 */${env.SCHEDULER_INTERVAL_MIN} * * * *`, async () => {
  runScheduler().catch(err => logger.error("Scheduler error:", err));
});

async function sendValidationRequest(submittedAssignments: any) {
  const ids = submittedAssignments.map((item: any) => item.id);
  updateAssignmentByIssuedStatus(ids, IssuedDelivaryStatus.PROCESSING);
  try {
    const payload = submittedAssignments.map(
      (assignment: VerifyIssuerDto) => ({
        id: assignment.id,
        issued_by: assignment.issued_by,
      }),
    );
    const response = await axios.post(
      `${env.VERIFICATION_SERVICE_URL}/validate-management/validate/register`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      },
    );
    const ids = response.data.map((item: any) => item.id);
    logger.info(`POST successful to validate API changed: ${response.data.length} records`);
    if (ids.length > 0) {
      updateAssignmentByIssuedStatus(ids, IssuedDelivaryStatus.PROCESSED);
    }
  }
  catch (error: any) {
    logger.error(`Failed to send POST request: ${error.response?.data || error.message}`);
    throw error;
  }
}
