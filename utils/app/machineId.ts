import { v4 } from 'uuid';

export default function getMachineId() {
  let machineId = localStorage.getItem('MachineId');

  if (!machineId) {
    machineId = v4();
    localStorage.setItem('MachineId', machineId ?? '');
  }

  return machineId;
}
