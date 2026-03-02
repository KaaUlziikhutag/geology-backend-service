export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}
export enum CustomerType {
  individual = 'INDIVIDUAL',
  organization = 'ORGANIZATION',
}
export enum Role {
  Admin = 'admin',
  User = 'user',
  Operator = 'operator', // Бүртгэлийн ажилтан
  Engineer = 'engineer', // Ерөнхий инженер
  Manager = 'manager', // Тасгийн эрхлэгч
  Industry = 'industry', // Үйлдвэрлэлийн ажилтан
  Laboratory = 'laboratory', // Лабораторийн ажилтан
  Analyst = 'analyst', // Хяналтын ажилтан
}
export enum ReceiptStatus {
  PAY = 'PAY', // Төлөх
  PAID = 'PAID', // Төлөгдсөн
  INVOICE_PAID = 'INVOICE_PAID', // Нэхэмжлэх төлөгдсөн
  SUCCESS = 'SUCCESS', // Баримт гарсан
  CANCELLED = 'CANCELLED', // Баримт цуцласан
}
export enum EbarimtTaxType {
  B2C_RECEIPT = 'B2C_RECEIPT', // Бизнес эрхлэгчээс хувь хүнд борлуулсан бүтээгдэхүүн, үйлчилгээний төлбөрийн баримт
  B2B_RECEIPT = 'B2B_RECEIPT', // Бизнес эрхлэгч хооронд борлуулсан бүтээгдэхүүн, үйлчилгээний төлбөрийн баримт
  B2C_INVOICE = 'B2C_INVOICE', // Бизнес эрхлэгчээс хувь хүнд борлуулсан бүтээгдэхүүн, үйлчилгээний нэхэмжлэх
  B2B_INVOICE = 'B2B_INVOICE', // Бизнес эрхлэгч хооронд борлуулсан бүтээгдэхүүн, үйлчилгээний нэхэмжлэх
}
export enum EbarimtPaymentCode {
  CASH = 'CASH', // Бэлнээр
  PAYMENT_CARD = 'PAYMENT_CARD', // Төлбөрийн карт
  BANK_TRANSFER = 'BANK_TRANSFER', // Банк шилжүүлэг
}
export enum PaymentStatus {
  PAID = 'PAID', // Төлбөр амжилттай хийгдсэнийг тодорхойлоно
  PAY = 'PAY', // Төлбөрийн мэдээллийг “Баримтын мэдээлэл солилцох сервис”-г ашиглан гүйцэтгэнэ.
  REVERSED = 'REVERSED', // Төлбөр буцаагдсан
  ERROR = 'ERROR', // Төлөлт амжилтгүй болсон
}
export enum TaxType {
  VAT_ABLE = 'VAT_ABLE', // НӨАТ тооцох бүтээгдэхүүн, үйлчилгээ
  VAT_FREE = 'VAT_FREE', // НӨАТ-аас чөлөөлөгдөх бүтээгдэхүүн, үйлчилгээ
  VAT_ZERO = 'VAT_ZERO', // НӨАТ-н 0 хувь тооцох бүтээгдэхүүн, үйлчилгээ
  NO_VAT = 'NO_VAT', // Монгол улсын хилийн гадна борлуулсан бүтээгдэхүүн үйлчилгээ
}

export enum ProductType {
  single = 'single', // Дан бүтээгдхүүн
  variable = 'variable', // Олон төрөлтэй бүтээгдхүүн
  // Examination = 'EXAMINATION', // шинжилгээ tolbor deer shinjilgee jin bodohgui
  // Inquiry = 'INQUIRY', // судалгаа
  // Industry = 'INDUSTRY', // үйлдвэрлэл
}
export enum SpendType {
  percentage = 'PERCENTAGE', // хувиар тооцох
  amount = 'AMOUNT', // дүнгээр тооцох
}
export enum MineralState {
  pending = 'PENDING', // дээж хүлээлгэж өгсөн
  analytic = 'ANALYTIC', // Аналитик дээж
  standard = 'STANDARD', // Стандарт дээж
}
export enum OrderState {
  Pending = 'PENDING', // хүлээлгэж өгсөн
  Approved = 'APPROVED', // зөвшөөрөгдсөн
  Rejected = 'REJECTED', // болиулсан
}
export enum TaskState {
  Pending = 'PENDING', // хүлээлгэж өгсөн
  InProgress = 'IN_PROGRESS', // ажиллаж байгаа
  Completed = 'COMPLETED', // дууссан
}
export enum AccessType {
  NotVisible = 0, // Харагдахгүй
  Simple = 1, // Энгийн
  LeadingLeader = 2, // Хөтлөн удирдагч
  ViewAllPosts = 3, // бүх бичлэгийг харах
}
export enum ContractState {
  Active = 1, // Идэвхтэй
  Draft = 2, // Ноорог
  Cancelled = 3, // Цуцлагдсан
  Completed = 4, // Дууссан
}
export enum DateType {
  Start = 1, // Эхлэх
  End = 2, // Дуусах
  Create = 3, // Үүссэн
  contractCreate = 4, // Байгуулсан онгоо
}
export enum RequestType {
  RegisterTime = 1, // Цаг бүртгүүлэх
  TakeLeave = 2, // Чөлөө авах
  TakeVacation = 3, // Амралт авах
  ShiftLeave = 4, // Ээлжийн амралт
  Appointment = 5, // Томилолт авах
  MoreTime = 6, // ИЛҮҮ цаг авах
  EnjoyMoreTime = 7, // илүү цаг биеэр эдлэх
}
export enum TimePeriod {
  Yearly = 1, // Жилд нэг удаа
  SemiAnnually = 2, // Хагас жилд нэг удаа
  Quarterly = 3, // Улирал тутамд
  Monthly = 4, // Сар бүр
  Daily = 5, // Өдөр бүр
}
export enum TypeStatus {
  BranchDepartment = 0, // Салбар хэлтэс
  Position = 1, // Албан тушаал
  Company = 2, // Компани
  Group = 3, // Бүлэг
}

export enum ScheduleStatus {
  Ongoing = 1, // Бүртгэгдэсэн
  OnLeave = 2, // Тасалсан
  OnError = 3, // Алдаа
  OnPermitted = 4, // Чөлөөтэй /зөвшөөрсөн/
}

export enum GenderType {
  Woman = 'WOMAN', // Эм
  Man = 'MAN', // Эр
  Trans = 'TRANS', // Эр эм холилдсон
}

export enum TimeCelebratoryType {
  PublicHoliday = 1, // Нийтээр амрах өдөр
  OrganizationalSpecial = 2, // Байгууллагын оцгой үйл явдалын өдрүүд
}

export enum CalculationType {
  Partial = 1, // Хагасаар
  Full = 2, // Бүтнээр
  Excluded = 3, // Тооцохгүй
}

export enum StartMonth {
  January = 1,
  February = 2,
  March = 3,
  April = 4,
  May = 5,
  June = 6,
  July = 7,
  August = 8,
  September = 9,
  October = 10,
  November = 11,
  December = 12,
}

export enum StartDate {
  Day1 = 1,
  Day2 = 2,
  Day3 = 3,
  Day4 = 4,
  Day5 = 5,
  Day6 = 6,
  Day7 = 7,
  Day8 = 8,
  Day9 = 9,
  Day10 = 10,
  Day11 = 11,
  Day12 = 12,
  Day13 = 13,
  Day14 = 14,
  Day15 = 15,
  Day16 = 16,
  Day17 = 17,
  Day18 = 18,
  Day19 = 19,
  Day20 = 20,
  Day21 = 21,
  Day22 = 22,
  Day23 = 23,
  Day24 = 24,
  Day25 = 25,
  Day26 = 26,
  Day27 = 27,
  Day28 = 28,
  Day29 = 29,
  Day30 = 30,
  Day31 = 31,
}

export enum TimeAccessType {
  Direct = 0, // Шууд
  Repeat = 1, //
}

export enum FileType {
  Folder = 1,
  File = 2,
}

export enum MaritalStatus {
  Married = 1, // Гэрлэсэн
  Single = 0, // Гэрлээгүй
  Widowed = 2, // Бэлэвсэн
  Divorced = 3, // Салсан
  Separated = 4, // Тусдаа амьдардаг
}

export enum TypeOfPosition {
  // Албан тушаалын төрөл
  Manage = 1, // Удирдах (Дэд шатны)
  Performance = 2, // Гүйцэтгэл
  Help = 3, //  Туслах
  Others = 4, // Бусад
  ManagementMidlevel = 5, // Удирдах (Дунд шатны)
}

export enum EmployeeType {
  // Ажилтны төрөл
  Basic = 0, // Үндсэн
  Contracted = 1, // Гэрээт
  Trial = 2, // Туршилт
  Accompanying = 3, // Дагалдан
  PartTime = 4, // Цагийн ажилтан
}

export enum TemporaryOptions {
  FullTime = 1, // Орон тооны
  PartTime = 2, // Орон тооны бус
}

export enum DepartmentType {
  Alba = 1, // Алба
  Heltes = 2, // Хэлтэс
  Tasag = 3, // Тасаг
  Laboratory = 4, // Лаборатори
  Salbar = 5, // Салбар
  Land = 6, // Газар
}

export enum ProgressStatus {
  AchievementCalculation = 1, // Биелэлт тооцох
  TimelyAchievement = 2, // Биелэлт хугцаатай
  Achievement = 3, // Биелэлт
}

export enum SecurityLevel {
  Normal = 1, // Энгийн
  Confidential = 2, // Нууц
  TopSecret = 3, // Маш Нууц
}

export enum DocumentTypes {
  aOrder = 1, // А Тушаал
  bOrder = 2, // Б Тушаал
  decision = 3, // Шийдвэр
  officialAssignment = 4, // Албан даалгавар
  officialRequirement = 5, // Албан шаардлага
  decree = 6, // Зарлиг
  directive = 7, // Захирамж
  resolution = 8, // Тогтоол
  law = 9, // Хууль
}

export enum PerformanceType {
  Monthly = 1, // Сарын
  Daily = 2, // Өдрийн
  Hourly = 3, // Цагийн
  TaskBased = 4, // Хийснээр
  PerformanceBased = 5, // Гүйцэтгэлээр
}

export enum ContractType {
  GeneralContract = 1, // Гэрээний бүртгэл
  EmploymentContract = 2, // Хөдөлмөрийн гэрээний бүртгэл
}

export enum DecisionType {
  Internal = 1, // Дотоод тушаал шийдвэр
  External = 2, // ЭББ-ийн тушаал шийдвэр
}

export enum DecisionCategory {
  aCommand = 1, // А Тушаал
  bCommand = 2, // Б Тушаал
  decision = 3, // Шийдвэр
}

export enum Situation {
  // Ажлын нөхцөл-НД
  Normal = 1, // Энгийн
  Underground = 2, // Газрын дор
  Hot = 3, // Халуун
  Toxic = 4, // Хортой
  Heavy = 5, // Хүнд
  Artistic = 6, // Урлагийн
  Railway = 7, // Төмөр зам
  Herdsman = 8, // Малчин
  Judge = 9, // Шүүгч
  ConstitutionalCourt = 10, // ҮХЦ (Үндсэн хуулийн цэц)
}

export enum WorkType {
  Active = 0, // Идэвхтэй
  Retired = 1, // Тэтгэвэрт гарсан
  MaternityLeave = 2, // Жирэмсний амралт
  HaveLongVacation = 3, // Урт хугацааны амралттай
  Freely = 4, // чөлөөтэй
  Fired = 5, // Халагдсан
  DismissedAtWill = 6, // Халагдсан өөрийн хүсэлтээр
  Died = 7, // Нас барсан
  Shift = 8, // Ээлжийн амралт
  Appointment = 9, // Томилолт
  ActiveRetired = 10, // Идэвхтэй Тэтгэвэрийн
}

export enum JobAction {
  Promotion = 1, // Албан тушаал дэвшсэн
  Demotion = 2, // Албан тушаал буурсан
  AdditionalDuty = 3, // Ажил хавсран гүйцэтгэх
  BetweenBranches = 4, // Салбар, нэгж хооронд шилжсэн
  BetweenCompanies = 5, // Компани хооронд шилжсэн
  Others = 6, // Бусад
}

export enum InnerDateType {
  OwnDate = 1, // Бичиг дээрх огноо
  ExcDate = 2, // Биелүүлж эхлэх огноо
  EndDate = 3, // Биелүүлж дуусах огноо
  SendDate = 4, // Илгээсэн огноо
  AnsweredDate = 5, //Хариу өгөх огноо
  CreatedAt = 6, // Үүссэн огноо
}

export enum StateType {
  Running = 0, // Явагдаж байгаа
  Completed = 1, // Дууссан
  Waiting = 2, // Хүлээгдэж байгаа
}

export enum Level {
  First = 0, // Анхан
  Medium = 1, //Дунд
  Advanced = 2, // Ахисан
}

export enum Levels {
  Beginner = 0, // Анхан
  PreIntermediate = 1, // Анхан дунд
  Intermediate = 2, // Дунд
  Advanced = 3, // Ахисан
}

export enum LevelType {
  Good = 0, // Сайн
  Medium = 1, //Дунд
  Bad = 2, // Муу
}

export enum ItechType {
  Software = 1, // Эзэмшсэн програм хангамж
  Private = 2, // Хувийн ур чадвар
}

export enum MistakesType {
  Reminder = 0, // Сануулга
  WageAction = 1, // Цалингийн арга хэмжээ
  DismissalFromWork = 2, // Ажилаас чөлөөлөх
  Demotion = 3, //   Албан тушаал бууруулах
  DisciplinaryAction = 4, // Сахилгын шийтгэл
}

export enum MoneyType {
  USD = 0, // Доллар
  CNY = 1, // Юань
  EUR = 2, // Евро
  RUB = 3, // Рубль
  KRW = 4, // Вон
  MNT = 5, // Төгрөг
}

export enum AppointmentType {
  TrainingSeminar = 0, // Сургалт семинар
  Meeting = 1, // хурал уулзал
  Other = 2, // Бусад
}

export enum AppointmentCostType {
  Personal = 0, // Хувийн
  Organization = 1, // Байгууллага
  Organizer = 2, // Зохион байгуулагч
  Other = 3, // Бусад
}

export enum AppointmentStatusType {
  Comfirm = 0, // Зөвшөөрсөн
  Cancelled = 1, // Цуцалсан
  Expected = 2, // Хүлээгдэж буй
  Transfer = 3, // Шилжүүлэг
}

export enum WorkTime {
  Holiday = 1, // Баяр ёслолын өдөр
  Weekend = 2, // Амралтын өдөр
  Night = 3, // Шөнийн цаг
  Weekday = 4, // Ажлын өдөр
}

export enum TimeEventType {
  ARRIVAL = 1, // Ирсэн цаг
  DEPARTURE = 2, // Явсан цаг
  BOTH = 3, // Ирсэн + Явсан цаг
}

export enum CompensationType {
  Salary = 1, // Цалингаар авах
  InKind = 2, // Биеэр эдлэх
}

export enum HolidayState {
  Author = 0, // Хариуцагч
  Shift = 1, // Шилжүүлсэн
}

export enum Homes {
  Home1 = 0, // Гэр хороололд гэр
  Home2 = 1, // Гэр хороололд байшин
  Home3 = 3, // Нийтийн байр
  Home4 = 4, // Орон сууц
  Home5 = 5, // Амины орон сууц /хаус/
  Other = 6, // Бусад
}

export enum MineType {
  Personal = 0, // Хувийн
  Rent = 1, // Түрээсийн
  Organizational = 2, // Байгууллагын
  Other = 3, // Бусад
}

export enum ExamType {
  Exam1 = 0, // Ерөнхий шалгалт
  Exam2 = 1, // Тусгай шалгалт
  Exam3 = 2, // Нөөцөд байгаа
}

export enum Education {
  Less = 0, // Бага
  Medium = 1, // Дунд
  Upper = 2, // Бүрэн дунд
  ProfessionalTechnical = 3, // Мэргэжлийн техникийн
  Bachelor = 4, // Бакалавр
  Master = 5, // Магистр
  Doctor = 6, // Доктор
  NoEducation = 7, // Боловсролгүй
}

export enum CountryType {
  Country = 'COUNTRY',
  Province = 'PROVINCE',
  District = 'DISTRICT',
  Khoroo = 'KHOROO',
}
export enum JobCategory {
  MainGroup = 0, // Үндсэн бүлэг
  SubGroup = 1, // Дэд бүлэг
  MinorGroup = 2, // Бага бүлэг
  UnitGroup = 3, // Нэгж бүлэг
  Occupation = 4, // Ажил мэргэжил
}

export enum MariageStatus {
  Single = 0, // Гэрлээгүй
  Confirm = 1, // Баталгаажуулсан гэр бүлтэй
  Unconfirm = 2, // Батлуулаагүй гэр бүлтэй
  Isolated = 3, // Өрх тусгаарласан
  Canceled = 4, // Цуцалсан
  Widowed = 5, // Бэлэвсэн
}

export enum ContactPersonStatus {
  Others = 0, // Бусад
  Father = 1, // Эцэг
  Mother = 2, // Эх
  Grandpa = 3, // Өвөө
  Grandma = 4, // Эмээ
  Brother = 5, // Ах
  Sister = 6, // Эгч
  Dvv = 7, // Дүү
  Relatives = 8, // Хамаатан садан
  Friends = 9, // Найз нөхөд
  Boy = 10, // Хүү
  Girl = 11, // Охин
  Wife = 12, // Эхнэр
  Husband = 13, // Нөхөр
  FatherInlaw = 14, // Хадам эцэг
  MotherInLaw = 15, // Хадам эх
  Bride = 16, // Бэр
  Groom = 17, // Хүргэн
}

export enum JobTypeStatus {
  PrivateSector = 0, // Хувийн хэвшилд
  PublicInstitutions = 1, // Төрийн байгууллагад
  Public = 2, // Олон нийтийн байгууллагад
  InternationalOrganization = 3, // Олон улсын байгууллага
  IndividualCommunity = 4, // Хувь нийлүүлсэн нийгэмлэг
  Personally = 5, // Хувиараа
  Unemployed = 6, // Ажилгүй
  Retired = 7, // Тэтгэвэрт
  Others = 8, // Бусад
}

export enum StructureType {
  Others = 0, // Бусад
  Position = 1, //Албан тушаал
  Department = 2, // Тасаг
  Cabinet = 3, // Кабинет
}

export enum SslType {
  None = 'none',
  Starttls = 'starttls',
  Ssltls = 'ssltls',
}

export enum MailAddressType {
  To = 'to',
  From = 'from',
  Cc = 'cc',
  Bcc = 'bcc',
  Sender = 'sender',
  ReplyTo = 'reply_to',
}

export enum MailType {
  Inbox = 1,
  Sent = 2,
  Draft = 3,
}

export enum ContactFormat {
  Ready = 1, // Бэлэн
  NotReady = 2, // Бэлэн бус
  Barter = 3, // Бартер
}
