import { Store } from "pullstate";
import { Block } from "./model";

export interface IHighlight {
  id: number;
  title: string;
  description: string;
}

interface IHighlightStore {
  highlights: IHighlight[];
  insertText: string;
  query: string;
  blocks: Block[];
}

export const HighlightStore = new Store<IHighlightStore>({
  highlights: [],
  insertText: "",
  query: "",
  blocks: [],
});
