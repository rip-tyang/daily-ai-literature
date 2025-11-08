const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const PromptFactory = require('./prompt_factory');

const dataPath = path.join(process.cwd(), '/data');
const getMaxDate = () => {
  const allData = fs.readdirSync(dataPath);
  allData.sort();
  const lastDate = allData[allData.length - 1]; // e.g. 2025-02-05.json
  return new Date(lastDate.slice(0, 10));
};

async function main() {
  let apiKey;
  if (process.argv.length == 2) {
    apiKey = fs.readFileSync('.secret').toString('utf-8');
  } else {
    apiKey = process.argv[2];
  }
  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey,
  });

  const prompts = PromptFactory.generatePrompt();
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          '你是一个作家。你需要根据用户的提示，生成文章。你需要尽可能遵循用户的要求，尤其注意用户对于主题、风格和文章结构的要求。用户只会提一次需求，你需要在第一次回答就生成完整的文章。如果有思考和构思的过程可以一并返回，但一定要保证第一次返回的内容就是完整的文章。不要再次询问用户，用户在提供一次需求后不会有后续交流。',
      },
      {
        role: 'user',
        content: prompts,
      },
    ],
    // model: 'deepseek-reasoner',
    model: 'deepseek-chat',
  });

  console.log(completion);
  const content = completion.choices[0].message.content;

  const newItem = {
    Title: ' ',
    Model: 'DeepSeek R1',
    Prompt: [prompts],
    Response: content,
  };
  const maxDate = getMaxDate();
  maxDate.setDate(maxDate.getDate() + 1);
  const newItemFileName = maxDate.toISOString().slice(0, 10) + '.json';
  fs.writeFileSync(
    path.join(dataPath, newItemFileName),
    JSON.stringify(newItem, null, 2)
  );
}

main();
