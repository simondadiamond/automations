import Airtable from 'airtable';

const AIRTABLE_TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;

// Configure Airtable with the personal access token
Airtable.configure({
  apiKey: AIRTABLE_TOKEN, // The library still uses apiKey parameter but accepts tokens
  endpointUrl: 'https://api.airtable.com',
});

const base = Airtable.base(AIRTABLE_BASE_ID);

export interface Automation {
  id: string;
  title: string;
  subtitle: string;
  webhookUrl: string;
  createdAt: string;
  updatedAt: string;
  inputs: AutomationInput[];
}

export interface AutomationInput {
  id: string;
  automationId: string;
  label: string;
  type: 'Text' | 'Audio' | 'Document' | 'Tone';
  value: string;
  order: number;
}

export const automationsTable = base('Automations');
export const inputsTable = base('Inputs');

export async function createAutomation(data: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'>) {
  const automation = await automationsTable.create([
    {
      fields: {
        Title: data.title,
        Subtitle: data.subtitle,
        'Webhook URL': data.webhookUrl,
      },
    },
  ]);

  const automationId = automation[0].id;
  
  const inputRecords = data.inputs.map((input, index) => ({
    fields: {
      Automation: [automationId],
      Label: input.label,
      Type: input.type,
      Value: input.value,
      Order: index + 1,
    },
  }));

  await inputsTable.create(inputRecords);

  return automationId;
}

export async function getAutomations(): Promise<Automation[]> {
  const records = await automationsTable
    .select({
      sort: [{ field: 'Created At', direction: 'desc' }],
    })
    .all();

  const automations = await Promise.all(
    records.map(async (record) => {
      const inputs = await inputsTable
        .select({
          filterByFormula: `{Automation} = "${record.id}"`,
          sort: [{ field: 'Order', direction: 'asc' }],
        })
        .all();

      return {
        id: record.id,
        title: record.get('Title') as string,
        subtitle: record.get('Subtitle') as string,
        webhookUrl: record.get('Webhook URL') as string,
        createdAt: record.get('Created At') as string,
        updatedAt: record.get('Updated At') as string,
        inputs: inputs.map((input) => ({
          id: input.id,
          automationId: record.id,
          label: input.get('Label') as string,
          type: input.get('Type') as 'Text' | 'Audio' | 'Document' | 'Tone',
          value: input.get('Value') as string,
          order: input.get('Order') as number,
        })),
      };
    })
  );

  return automations;
}

export async function updateAutomation(id: string, data: Partial<Automation>) {
  await automationsTable.update([
    {
      id,
      fields: {
        Title: data.title,
        Subtitle: data.subtitle,
        'Webhook URL': data.webhookUrl,
      },
    },
  ]);

  if (data.inputs) {
    // Delete existing inputs
    const existingInputs = await inputsTable
      .select({
        filterByFormula: `{Automation} = "${id}"`,
      })
      .all();

    await Promise.all(
      existingInputs.map((input) => inputsTable.destroy(input.id))
    );

    // Create new inputs
    const inputRecords = data.inputs.map((input, index) => ({
      fields: {
        Automation: [id],
        Label: input.label,
        Type: input.type,
        Value: input.value,
        Order: index + 1,
      },
    }));

    await inputsTable.create(inputRecords);
  }
}

export async function deleteAutomation(id: string) {
  const inputs = await inputsTable
    .select({
      filterByFormula: `{Automation} = "${id}"`,
    })
    .all();

  await Promise.all(inputs.map((input) => inputsTable.destroy(input.id)));
  await automationsTable.destroy(id);
}