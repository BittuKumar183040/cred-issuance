import type { IssuedDelivaryStatus } from "../enum/issued-status.js";

type IssueResponse = {
  id: string;
  username: string;
  issued_status: IssuedDelivaryStatus;
  issued_by: string;
  issued_at: number;
};

export default IssueResponse;
