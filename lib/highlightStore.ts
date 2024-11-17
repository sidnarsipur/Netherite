import { Store } from "pullstate";

export interface IHighlight {
  id: number;
  title: string;
  description: string;
}

interface IHighlightStore {
  highlights: IHighlight[];
  insertText: string;
}

export const HighlightStore = new Store<IHighlightStore>({
  highlights: [],
  insertText: "",
});
