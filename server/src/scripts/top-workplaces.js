console.log("TODO: Implement me!");
import axios from 'axios';
interface Workplace {
  id: string;
  name: string;
}
interface Shift {
  id: string;
  workplaceId: string;
  status: string;
}
const BASE_URL = 'http://localhost:3000'; // update if using different base URL
async function getWorkplaces(): Promise<Workplace[]> {
  const res = await axios.get(`${BASE_URL}/workplaces`);
  return res.data;
}
async function getShifts(): Promise<Shift[]> {
  const res = await axios.get(`${BASE_URL}/shifts`);
  return res.data;
}
async function main() {
  try {
    const [workplaces, shifts] = await Promise.all([
      getWorkplaces(),
      getShifts()
    ]);
    // Count completed shifts per workplace
    const shiftCounts: Record<string, number> = {};
    for (const shift of shifts) {
      if (shift.status === 'completed') {
        shiftCounts[shift.workplaceId] = (shiftCounts[shift.workplaceId] || 0) + 1;
      }
    }
    // Merge with workplace names
    const results = Object.entries(shiftCounts).map(([workplaceId, count]) => {
      const workplace = workplaces.find(w => w.id === workplaceId);
      return {
        name: workplace?.name ?? 'Unknown',
        shifts: count
      };
    });
    // Sort and log top 3
    results
      .sort((a, b) => b.shifts - a.shifts)
      .slice(0, 3)
      .forEach(({ name, shifts }) => {
        console.log(`{ name: "${name}", shifts: ${shifts} },`);
      });
  } catch (err) {
    console.error('Failed to fetch data:', err.message);
  }
  
}
main();
