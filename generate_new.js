const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const THEMES = [
  '根据近期的时事政治事件，世界局势变化等，',
  '根据近期的科技新闻，技术突破，新产品发布等，',
  '根据近期的社会热点，文化现象，流行趋势等，',
  '根据近期的经济数据，市场动态，行业发展等，',
  '根据近期的环境问题，气候变化，生态保护等，',
  '根据近期的教育改革，学术研究，人才培养等，',
  '根据近期的健康医疗，公共卫生，疾病防控等，',
];
const STYLES = [
  '写一段科幻风格的文章，注意构造严谨的科幻主题背景，避免天马行空的单纯想象。',
  '写一段散文风格的文章，注重语言的优美和意境的营造，避免过于直白的叙述。',
  '写一篇纪实风格的文章，注重事实的准确性和客观性，避免主观臆断。',
  '写一段访谈风格的文章，注意对话的自然流畅和人物性格的真实刻画。',
];

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

  const theme = THEMES[Math.floor(THEMES.length * Math.random())];
  const style = STYLES[Math.floor(STYLES.length * Math.random())];
  const prompts = `
  ${theme}
  ${style}
  字数在5000字左右。
  `;
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          '你是一个作家。你需要根据用户的提示，生成文章。你需要尽可能遵循用户的要求，尤其注意用户对于主题、风格和文章结构的要求。',
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
