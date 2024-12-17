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
  Examination = 'EXAMINATION', // шинжилгээ tolbor deer shinjilgee jin bodohgui
  Inquiry = 'INQUIRY', // судалгаа
  Industry = 'INDUSTRY', // үйлдвэрлэл
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
