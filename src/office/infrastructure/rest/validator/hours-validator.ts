const getNumberHour = (time: string): [number, number] => {
  return [parseInt(time.split(':')[0]), parseInt(time.split(':')[1])];
};

export const validateHours = (startTime: string, endTime: string) => {
  if (!startTime && !endTime) {
    return true;
  }

  const start = new Date();
  const end = new Date();
  const [startHour, startMinute] = getNumberHour(startTime);
  const [endHour, endMinute] = getNumberHour(endTime);

  start.setHours(startHour, startMinute);
  end.setHours(endHour, endMinute);

  return start < end;
};
