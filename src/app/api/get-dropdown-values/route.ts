import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

/**
 * Batch gets cell values from a Spreadsheet.
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} _ranges The mock sheet range.
 * @return {obj} spreadsheet information
 */
async function batchGetValues(spreadsheetId: string, _ranges: Array<string>) {

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

  const service = google.sheets({ version: 'v4', auth });
  const range = 'A:C';

  // eslint-disable-next-line no-useless-catch
  try {
    const result = await service.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return result.data.values;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}

export async function GET() {
  const values = await batchGetValues(
    '1P9L2q5bvgTOsbLZL7agdHw8OXvgEnZRwzqM-bSdPYbk',
    ['A', 'B']
  );
  const response = {
    ProductLines: new Set<string>(),
    Categories: new Set<string>(),
    Subcategories: new Set<string>(),
  };
  values?.slice(1).forEach((row: Array<string>) => {
    response.ProductLines.add(row[0]);
    response.Categories.add(row[1]);
    response.Subcategories.add(row[2]);
  });

  return NextResponse.json({
    ProductLines: Array.from(response.ProductLines),
    Categories: Array.from(response.Categories),
    Subcategories: Array.from(response.Subcategories),
  });
}
