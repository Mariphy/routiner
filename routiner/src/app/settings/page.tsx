import { addImportLink } from "@/app/actions/calendarImport";
   
export default async function SettingsPage() {
    const addLinkAction = async (formData: FormData) => {
        'use server';
        const res = await addImportLink(formData);
        if (!res.success) {
            console.error('Failed to add import link:', res.error);
        }
    }
    
    return (
        <div className="pt-20 px-6">
            <p>If you would like to import events from another calendar, please provide the subscription link below. You can currently add one link, each new entry will override the previous one.</p>
            <form action={addLinkAction} className="mt-4 flex items-center gap-2">
                <label htmlFor="importURL">Import URL:</label>
                <input
                    type="url"
                    id="importURL"
                    name="importURL"
                    placeholder="https://example.com/calendar.ics"
                    className="border p-2 rounded"
                    pattern="https://.*"
                    title="Please enter a valid HTTPS URL"
                    required
                />
                <button type="submit" className="bg-accent text-white px-4 py-2 rounded hover:bg-blue-600 ml-4">
                    Add
                </button>
            </form>
        </div>
    )
}