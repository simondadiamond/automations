import Airtable from 'airtable';

const AIRTABLE_TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;

// Configure Airtable with the personal access token
Airtable.configure({
  apiKey: AIRTABLE_TOKEN,
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

export async function getAutomationById(id: string): Promise<Automation> {
  // Fetch the automation record.
  const record = await automationsTable.find(id);
  const title = record.get('Title') as string;

  // Ensure inputIds is always an array, even if the field is undefined.
  const inputIds = (record.fields.Inputs || []) as string[];

  let inputs: any[] = [];
  if (inputIds.length > 0) {
    // Build the filter formula to match any of the input IDs.
    const filterFormula = `OR(${inputIds
      .map((inputId) => `RECORD_ID()='${inputId}'`)
      .join(', ')})`;

    // Fetch the inputs whose record IDs are in the inputIds array.
    inputs = await inputsTable
      .select({
        filterByFormula: filterFormula,
        sort: [{ field: 'Order', direction: 'asc' }],
      })
      .all();

  } else {
    // Safety net: No input IDs available, so we log a message and leave inputs as an empty array.
    console.log('No input IDs found for this automation. Setting inputs to an empty array.');
  }

  return {
    id: record.id,
    title,
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
}


export async function updateAutomation(id: string, data: Partial<Automation>) {
  console.log('Fetched data:', data);

  const record = await automationsTable.find(id);
  console.log('Fetched automation record:', record);

  // Update the automation record.
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
    // Get the array of input IDs from the automation record's fields.
    // (This field should be set in the automation record.)
    const inputIds = (record.fields.Inputs || []) as string[];

    if (inputIds.length > 0) {
      // Build a filter formula that matches any record whose RECORD_ID() is in the inputIds array.
      // For example: OR(RECORD_ID()='rec1', RECORD_ID()='rec2', ...)
      const filterFormula = `OR(${inputIds
        .map((inputId) => `RECORD_ID()='${inputId}'`)
        .join(', ')})`;

      // Retrieve all input records with a record ID from the inputIds array.
      const existingInputs = await inputsTable
        .select({
          filterByFormula: filterFormula,
        })
        .all();

      console.log('Fetched existingInputs:', existingInputs);

      // Delete all matching input records.
      await Promise.all(
        existingInputs.map((input) => inputsTable.destroy(input.id))
      );
    } else {
      console.log("No input IDs found in the automation record's Inputs field.");
    }

    // Now create new input records based on data.inputs.
    // Each new input record will reference the automation id in its "Automation" field.
    const inputRecords = data.inputs.map((input, index) => ({
      fields: {
        Automation: [id],
        Label: input.label,
        Type: input.type,
        Value: input.value,
        Order: index + 1,
      },
    }));

    // Create new records in the inputsTable.
    const createdInputs = await inputsTable.create(inputRecords);
    console.log('Created new inputs:', createdInputs);
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
