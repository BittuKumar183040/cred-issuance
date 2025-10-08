import type IssueResponse from "@/dto/issue-dto";

import express from "express";

const router = express.Router();

router.get<object, IssueResponse>("/", (req, res) => {
  res.json({ id: "abc" } as IssueResponse);
});

export default router;
