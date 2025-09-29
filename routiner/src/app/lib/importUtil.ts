import ICAL from 'node-ical';
import IcalExpander from 'ical-expander';
import type { ExternalEvent } from "@/app/types.ts";

export interface ParsedICSEvent {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  isAllDay: boolean;
  recurrence?: any;
}

export async function parseICSFromUrl(url: string): Promise<ParsedICSEvent[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch calendar: ${response.status}`);
    }
    
    const icsData = await response.text();
    return parseICSData(icsData);
  } catch (error) {
    console.error('Error parsing ICS from URL:', error);
    throw error;
  }
}

export function parseICSData(icsData: string): ParsedICSEvent[] {
  const events: ParsedICSEvent[] = [];
  
  try {
    const parsed = ICAL.parseICS(icsData);
    
    for (const key in parsed) {
      const event = parsed[key];
      
      if (event.type === 'VEVENT') {
        const startDate = new Date(event.start);
        const endDate = new Date(event.end || event.start);
        
        events.push({
          uid: event.uid || key,
          title: event.summary || 'Untitled Event',
          description: event.description,
          location: event.location,
          startDate,
          endDate,
          isAllDay: !event.start.getHours && !event.start.getMinutes,
          recurrence: event.rrule
        });
      }
    }
    
    return events;
  } catch (error) {
    console.error('Error parsing ICS data:', error);
    throw error;
  }
}

export function expandRecurringEvents(
  icsData: string, 
  startDate: Date, 
  endDate: Date
): ParsedICSEvent[] {
  try {
    const icalExpander = new IcalExpander({ ics: icsData, maxIterations: 1000 });
    const expandedEvents = icalExpander.between(startDate, endDate);
    
    const events: ParsedICSEvent[] = [];
    
    // Handle single events
    expandedEvents.events.forEach((event: any) => {
      events.push({
        uid: event.uid,
        title: event.summary,
        description: event.description,
        location: event.location,
        startDate: event.startDate.toJSDate(),
        endDate: event.endDate.toJSDate(),
        isAllDay: event.isFullDay,
      });
    });
    
    // Handle recurring events
    expandedEvents.occurrences.forEach((occurrence: any) => {
      events.push({
        uid: `${occurrence.uid}-${occurrence.startDate.toISOString()}`,
        title: occurrence.summary,
        description: occurrence.description,
        location: occurrence.location,
        startDate: occurrence.startDate.toJSDate(),
        endDate: occurrence.endDate.toJSDate(),
        isAllDay: occurrence.isFullDay,
      });
    });
    
    return events;
  } catch (error) {
    console.error('Error expanding recurring events:', error);
    throw error;
  }
}