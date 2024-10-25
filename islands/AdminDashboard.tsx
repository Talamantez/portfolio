// islands/AdminDashboard.tsx

export default function AdminDashboard() {
  const sections = [
    {
      title: 'KV Inspector',
      description: 'Inspect and manage KV database entries',
      icon: <Database class="w-6 h-6" />,
      link: '/admin/kv-inspect',
      color: 'bg-blue-50 hover:bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Newsletter',
      description: 'Manage newsletter content and subscribers',
      icon: <Mail class="w-6 h-6" />,
      link: '/admin/newsletter',
      color: 'bg-purple-50 hover:bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div class="p-6 max-w-6xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="text-gray-600">Manage your site settings and content</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          
            <a key={section.title}
            href={section.link}
            class={`${section.color} p-6 rounded-lg cursor-pointer transition-all hover:shadow-md`}
          >
            <div class={`${section.iconColor} mb-4`}>
              {section.icon}
            </div>
            <h2 class="text-lg font-semibold text-gray-900 mb-2">
              {section.title}
            </h2>
            <p class="text-gray-600">
              {section.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}