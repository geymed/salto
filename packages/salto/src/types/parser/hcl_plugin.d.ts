declare class HCLBlock {
  type: string
  labels: string[]
  attrs: Record<string, any>
  blocks: HCLBlock[]
}

declare class HclParseArgs {
  src: string
  filename: string
}

declare class HclParseReturn {
  body: HCLBlock
  errors: string[]
}

declare class HclDumpArgs {
  body: HCLBlock
}

type HclDumpReturn = Buffer

type HclArgs = HclParseArgs | HclDumpArgs
type HclReturn = HclParseReturn | HclDumpReturn

declare class HclCallContext {
  func: 'parse' | 'dump'
  callback?: () => void
  args: HclArgs
  return?: HclReturn
}

declare namespace NodeJS {
  interface Global {
    hclParserCall: Record<number, HclCallContext>
  }
}