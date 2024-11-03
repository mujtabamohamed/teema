import RouteGuard from '@/components/RouteGuard';

export default function TeamsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <RouteGuard>{children}</RouteGuard>;
}