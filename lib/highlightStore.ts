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
  highlights: [
    { id: 1, title: "Highlight 1", description: "This is highlight 1" },
    { id: 2, title: "Highlight 2", description: "This is highlight 2" },
  ],
});
