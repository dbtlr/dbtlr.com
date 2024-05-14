import type { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [
    { title: 'Drew Butler' },
    {
      name: 'description',
      content: 'Drew Butler',
    },
  ];
};

export default function Index() {
  return (
    <div>
      <h1>Drew Butler</h1>
    </div>
  );
}
