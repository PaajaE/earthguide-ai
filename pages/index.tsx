import Main from '@/components/main'
import { airlinesData } from '@/utils/data/airlines';

export default function Home() {
  return (
    <Main airlineData={airlinesData.default} />
  );
}
