// routes/admin/kv-inspector.tsx
import { PageProps } from "$fresh/server.ts";
import KvInspect from "../../islands/KvInspector.tsx";

interface PageData {
    session: {
        username: string;
        isAdmin: boolean;
    };
}

export default function KvInspector(props: PageProps<PageData>) {
    const { username } = props.data.session;

    return (
        <div>
            <header class="p-4 bg-white shadow">
                <div class="flex justify-between items-center">
                    <h1>KV Inspector</h1>
                    <div class="flex items-center gap-4">
                        <span>Welcome, {username}</span>
                        <a href="/logout" class="text-red-600">Logout</a>
                    </div>
                </div>
            </header>
            <KvInspect />
        </div>
    );
}
