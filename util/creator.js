var { varConfig } = require("../var");

const varArr = Object.keys(varConfig);
const commenArr = Object.values(varConfig);

var formatToUpperCaseWithUnderscores = (input) => {
  let formatted = input.replace(/[A-Z]+/g, (value) => {
    return `_${value}`;
  });
  formatted = formatted.toUpperCase();
  return formatted;
};

var apiCreator = () => {
  const importTypes = varArr.reduce((cur, pre) => {
    return (cur += `${pre}Type, ${pre}ResponseType, `);
  }, ``);
  const importTypesResult = `import { ${importTypes} } from './typings';\n`;

  return varArr.reduce((cur, pre, index) => {
    return (cur += `/** ${commenArr?.[index]} */ \nexport async function ${pre}(data: ${pre}Type) {
        return request<${pre}ResponseType>(\`\`, {
            method: 'POST',
            data,
        });
    }\n\n`);
  }, `${importTypesResult}\nimport { request } from '@umijs/max';\n\n`);
};

var modelCreator = () => {
  const importTypes = varArr.reduce((cur, pre) => {
    return (cur += `${pre}, `);
  }, ``);
  const importTypesResult = `import { ${importTypes} } from '@/services/';\n`;

  const reducersResult = varArr.reduce((cur, pre, index) => {
    return (cur += `${pre}Reducer: (state: any, { pyload }: {pyload: any}) => {
        return { ...state, xx: pyload };
    },\n`);
  }, ``);

  const effectsResult = varArr.reduce((cur, pre, index) => {
    return (cur += `/** ${
      commenArr?.[index]
    } */\n*${formatToUpperCaseWithUnderscores(
      pre
    )}({ pyload }: {pyload: any}, { call, put }: any) {
        const result = yield call(${pre}, pyload);
        yield put({ type: '${pre}Reducer', pyload: result });
    },\n`);
  }, ``);

  return `
    ${importTypesResult}
    export default {
        namespace: '',
        /** 初始化状态 */
        state: {},
        /** Reducers */
        reducers: {
            ${reducersResult}
        },
        /** Effects */
        effects: {
            ${effectsResult}
        },
    };
  `;
};

var typeCreator = () => {
  return varArr.reduce((cur, pre, index) => {
    return (cur += `/** ${commenArr?.[index]} */ \nexport interface ${pre}Type {}\nexport interface ${pre}ResponseType {}\n\n`);
  }, ``);
};

module.exports = {
  apiCreator,
  modelCreator,
  typeCreator,
};
