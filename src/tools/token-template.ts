
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';

const createTokenTemplateFile: Tool = {
  name: 'create_token_template_file',
  description: 'Creates a template .ebay-mcp-tokens.json file in the project root.',
  inputSchema: {},
  outputSchema: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
      },
    },
  },
  execute: async () => {
    const template = {
      "user_access_token": "YOUR_USER_ACCESS_TOKEN",
      "user_refresh_token": "YOUR_USER_REFRESH_TOKEN",
      "user_token_expiry": "YYYY-MM-DDTHH:mm:ss.SSSZ",
      "client_credentials_token": "YOUR_CLIENT_CREDENTIALS_TOKEN",
      "client_token_expiry": "YYYY-MM-DDTHH:mm:ss.SSSZ"
    };
    const filePath = path.join(process.cwd(), '.ebay-mcp-tokens.json');
    try {
      await fs.writeFile(filePath, JSON.stringify(template, null, 2));
      return {
        message: `Successfully created .ebay-mcp-tokens.json in the project root.`,
      };
    } catch (error) {
      return {
        message: `Error creating .ebay-mcp-tokens.json: ${error.message}`,
      };
    }
  },
};

export default createTokenTemplateFile;
