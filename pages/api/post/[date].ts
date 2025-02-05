import type { NextApiRequest, NextApiResponse } from 'next';
import type { GeneralError, Post } from '../../../types';

import fs from 'fs';
import path from 'path';

export default function Handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | GeneralError>,
) {
  const { date } = req.query;
  const filePath = path.join(process.cwd(), `/data/${date}.json`);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: `cannot find post for ${date}` });

    return;
  }

  const dataFile = fs.readFileSync(filePath, 'utf-8');
  const doc = JSON.parse(dataFile);

  res.status(200).json(doc);
}
