import type { IssuedDelivaryStatus } from "@/enum/issued-status";

type IssueResponse = {
  id: string;
  username: string;
  issued_by: string;
  issued_at: number;
  issued_status: IssuedDelivaryStatus;
};

export default IssueResponse;
