// page-break.ts
import { Node, mergeAttributes, RawCommands } from "@tiptap/core";

const PageBreak = Node.create({
	name: "pageBreak",
	group: "block",
	atom: true,

	parseHTML() {
		return [{ tag: "hr[data-page-break]" }];
	},

	renderHTML({ HTMLAttributes }) {
		return ["hr", mergeAttributes(HTMLAttributes, { "data-page-break": "" })];
	},

	addCommands() {
		return {
			setPageBreak:
				() =>
				({ chain }: { chain: any }) => {
					return chain()
						.insertContent({
							type: this.name,
						})
						.run();
				},
		} as Partial<RawCommands>;
	},
});

export default PageBreak;
