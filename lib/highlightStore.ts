import { Store } from "pullstate";

export interface IHighlight {
  id: number;
  title: string;
  description: string;
}

interface IHighlightStore {
  highlights: IHighlight[];
}

export const HighlightStore = new Store<IHighlightStore>({
  highlights: [],
});
