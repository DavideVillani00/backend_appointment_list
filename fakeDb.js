const USERS = [
  {
    id: 1,
    role: "admin",
    userName: "dado",
    email: "davide@gino.col",
    password: "Admin.123",
    name: "davide",
    surname: "villani",
    gender: "male",
    company: "none",
  },
  {
    id: 2,
    role: "user",
    userName: "gianzi",
    email: "gian@carlo.zuc",
    password: "User.123",
    name: "giancarlo",
    surname: "zilioli",
    gender: "male",
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
