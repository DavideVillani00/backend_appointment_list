const USERS = [
  {
    id: 1,
    role: "admin",
    userName: "dado",
    name: "davide",
    surname: "villani",
    gender: "male",
    email: "davide@gino.col",
    company: "none",
  },
  {
    id: 2,
    role: "user",
    userName: "gianzi",
    name: "giancarlo",
    surname: "zilioli",
    gender: "male",
    email: "gian@carlo.zuc",
    company: "carlo srl",
  },
];

const APPOINTMENT_LIST = [
  {
    id: 1,
    userName: "dado",
    title: "giocare a palla con mio figlio",
    date: "2025/04/08",
    time: "17:05",
    check: false,
  },
  {
    id: 2,
    userName: "gianzi",
    title: "lavorare",
    date: "2025/04/07",
    time: "08:00",
    check: true,
  },
  {
    id: 3,
    userName: "dado",
    title: "diventare ricchi",
    date: "2110/12/01",
    time: "09:35",
    check: false,
  },
];

module.exports = { USERS, APPOINTMENT_LIST };
