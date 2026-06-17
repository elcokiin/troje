"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdeasList } from "@/components/ideas/ideas-list";
import { Inbox, Archive, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TabValue = "inbox" | "archived" | "deleted";

interface IdeasTabsProps {
  value: TabValue;
  onValueChange: (value: TabValue) => void;
  tabsClassName?: string;
  tabsListClassName?: string;
  triggerClassName?: string;
  tabsListWrapperClassName?: string;
  contentWrapperClassName?: string;
  showLabels?: boolean;
  hideCaptureInbox?: boolean;
  children?: ReactNode;
}

export function IdeasTabs({
  value,
  onValueChange,
  tabsClassName,
  tabsListClassName,
  triggerClassName,
  tabsListWrapperClassName,
  contentWrapperClassName,
  showLabels = true,
  hideCaptureInbox = false,
  children,
}: IdeasTabsProps) {
  const mobile = !showLabels;

  const tabsListContent = (
    <TabsList
      className={cn(
        tabsListClassName,
        mobile && "flex w-full rounded-none h-10",
      )}
    >
      <TabsTrigger
        value="archived"
        className={cn(
          triggerClassName,
          "group",
          mobile &&
            "rounded-none border-0 border-r border-dashed border-muted-foreground data-[state=active]:border-l data-[state=active]:flex-1 data-[state=inactive]:flex-none data-[state=inactive]:px-4",
        )}
      >
        <Archive
          className={cn("size-4", mobile && "group-data-[state=active]:hidden")}
        />
        {showLabels && <span className="hidden sm:inline">Archived</span>}
        {mobile && (
          <span className="hidden group-data-[state=active]:inline uppercase text-xs font-bold tracking-widest">
            Archived
          </span>
        )}
      </TabsTrigger>
      <TabsTrigger
        value="inbox"
        className={cn(
          triggerClassName,
          "group",
          mobile &&
            "rounded-none border-0 data-[state=active]:border-x data-[state=active]:border-dashed data-[state=active]:border-muted-foreground data-[state=active]:flex-1 data-[state=inactive]:flex-none data-[state=inactive]:px-4",
        )}
      >
        <Inbox
          className={cn("size-4", mobile && "group-data-[state=active]:hidden")}
        />
        {showLabels && <span className="hidden sm:inline">Inbox</span>}
        {mobile && (
          <span className="hidden group-data-[state=active]:inline uppercase text-xs font-bold tracking-widest">
            Inbox
          </span>
        )}
      </TabsTrigger>
      <TabsTrigger
        value="deleted"
        className={cn(
          triggerClassName,
          "group",
          mobile &&
            "rounded-none border-0 border-l border-dashed border-muted-foreground data-[state=active]:border-r data-[state=active]:flex-1 data-[state=inactive]:flex-none data-[state=inactive]:px-4",
        )}
      >
        <Trash2
          className={cn("size-4", mobile && "group-data-[state=active]:hidden")}
        />
        {showLabels && <span className="hidden sm:inline">Trash</span>}
        {mobile && (
          <span className="hidden group-data-[state=active]:inline uppercase text-xs font-bold tracking-widest">
            Trash
          </span>
        )}
      </TabsTrigger>
    </TabsList>
  );

  const tabsContent = (
    <>
      <TabsContent value="inbox">
        <IdeasList
          status="inbox"
          active={value === "inbox"}
          hideCapture={hideCaptureInbox}
        />
      </TabsContent>

      <TabsContent value="archived">
        <IdeasList status="archived" active={value === "archived"} />
      </TabsContent>

      <TabsContent value="deleted">
        <IdeasList status="deleted" active={value === "deleted"} />
      </TabsContent>
    </>
  );

  return (
    <Tabs
      value={value}
      onValueChange={(v) => onValueChange(v as TabValue)}
      className={tabsClassName}
    >
      {tabsListWrapperClassName ? (
        <div className={tabsListWrapperClassName}>
          {children}
          {tabsListContent}
        </div>
      ) : (
        <>
          {children}
          {tabsListContent}
        </>
      )}

      {contentWrapperClassName ? (
        <div className={contentWrapperClassName}>{tabsContent}</div>
      ) : (
        tabsContent
      )}
    </Tabs>
  );
}
