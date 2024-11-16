import { Search, FolderClosed, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import parseSidebarData from '@/lib/sidebarDataParser';

export function Sidebar() {
	const data = parseSidebarData();
	return (
		<div className="w-80 border-r border-border bg-muted flex flex-col">
			<div className="p-4 flex items-center justify-between">
				<h1 className="text-xl font-semibold">concept.ai</h1>
				<div className="flex gap-1">
					<Button variant="ghost" size="icon">
						<FolderClosed className="h-5 w-5" />
					</Button>
					<Button variant="ghost" size="icon">
						<Plus className="h-5 w-5" />
					</Button>
				</div>
			</div>

			<div className="px-4 pb-4">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<input
						className="w-full bg-background/50 pl-9 pr-4 py-2 text-sm rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary"
						placeholder="Search notes..."
					/>
				</div>
			</div>

			<ScrollArea className="flex-1">
				<div className="px-2 py-2">
					{Array.from({ length: 10 }).map((_, i) => (
						<button
							key={i}
							className="w-full text-left p-3 rounded-md hover:bg-accent/50 transition-colors"
						>
							<h3 className="font-medium mb-1">Note Title</h3>
							<p className="text-sm text-muted-foreground truncate">
								Description of note and whatnot...
							</p>
						</button>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
