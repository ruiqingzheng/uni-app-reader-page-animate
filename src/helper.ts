export interface ILine {
  id: number | string
  txt: string
}

const mockTxt = [
  '北国风光，千里冰封，万里雪飘。',
  '望长城内外，惟余莽莽；大河上下，顿失滔滔。(余 通：馀)',
  '山舞银蛇，原驰蜡象，欲与天公试比高。(原驰 原作：原驱)',
  '须晴日，看红装素裹，分外妖娆。(红装 一作：银装)',
  '江山如此多娇，引无数英雄竞折腰。',
  '惜秦皇汉武，略输文采；唐宗宋祖，稍逊风骚。',
  '一代天骄，成吉思汗，只识弯弓射大雕。',
  '俱往矣，数风流人物，还看今朝。'
]

export function mockData(): Array<ILine> {
  const txtData = [
    ...mockTxt,
    ...mockTxt,
    ...mockTxt,
    ...mockTxt,
    ...mockTxt,
    ...mockTxt
  ]
  const _data = txtData.reduce((acc, txt, index) => {
    acc.push({ id: index, txt } as ILine)
    return acc
  }, [] as ILine[])
  return _data
}

export interface IScrollDetail {
  scrollLeft: number
  scrollTop: number
  scrollHeight: number
  scrollWidth: number
  deltaX: number
  deltaY: number
}
