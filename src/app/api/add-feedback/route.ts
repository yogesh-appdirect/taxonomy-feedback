/* eslint-disable no-useless-catch */
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
// import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from 'next/server';


const base64EncodedPrivateKey = String(process.env.GOOGLE_PRIVATE_KEY);
const decodedPrivateKey = Buffer.from(base64EncodedPrivateKey, 'base64').toString('utf-8');
const privateKey = JSON.parse(decodedPrivateKey);


const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
  credentials: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key: privateKey,
  },
});

const sheets = google.sheets({ version: 'v4', auth });

async function addRecordsToSheet(records: Array<Array<string>>) {
  const spreadsheetId = '1lnZXY56yx6EH-um4EpnZILxV1ld0W1QM8bMVHbWmn0M';
  const range = 'feedback-sheet';
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: records,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function POST(req: Request | NextRequest) {
  const body = await req.json();

  const {
    prompt,
    answer: { ProductLine, Category, Subcategory },
  } = body;

  const records = [[prompt, ProductLine, Category, Subcategory]];

  try {
    await addRecordsToSheet(records);
  } catch (error) {
    return NextResponse.json({ msg: 'An Error occured!' });
  }

  return NextResponse.json({ msg: 'Data added successfully!' });
}
