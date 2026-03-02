import { RequestType, TimePeriod } from '@utils/enum-utils';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { HierarchyDto } from './dto/hierarchy.dto';
import TimeRequest from '../time-request.entity';
import { AbstractEntity } from '@utils/abstract.entity';

@Entity('time_access_time_request_time_state_i')
export default class TimeState extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RequestType,
    nullable: true,
  })
  public type: RequestType; // Төрөл

  @Column('varchar', { length: 4000, nullable: true })
  name: string; // Хүсэлтийн нэр

  @Column({ name: 'com_id', nullable: true })
  comId: number; // Company id

  @Column('varchar', { length: 4000, nullable: true })
  description: string; // Хүсэлтийн тайлбар

  @Column('varchar', { length: 4000, nullable: true })
  color: string; // өнгө

  @Column({ name: 'is_work', default: false })
  isWork: boolean; // Ажилсанд тооцох эсэх

  @Column({ name: 'is_file', default: false })
  isFile: boolean; // Хавсралттай эсэх

  @Column({ name: 'limit_month', default: false })
  limitMonth: boolean; // өнгөрсөн сард нөхөлт олгох хязгаар

  @Column('varchar', { name: 'limit_hours1', length: 4000, nullable: true })
  limitHours1: string; // цаг

  @Column({ name: 'limit_type1', nullable: true })
  limitType1: number; // удаагаар цагаар

  @Column({ name: 'is_receiving_requests', default: false })
  isReceivingRequests: boolean; // хүсэлт хүлээн авах өдрийн хязгаар

  @Column({ nullable: true })
  deadline: number; // хягаар

  @Column({ name: 'is_set_request_limit', default: false })
  isSetRequestLimit: boolean; // хүсэлт хязгаар тогтоох

  @Column({ name: 'is_showing_excess', default: false })
  isShowingExcess: boolean; // хэтрэлт харуулан

  @Column('varchar', { name: 'limit_hours2', length: 4000, nullable: true })
  limitHours2: string; // цаг

  @Column({ name: 'limit_type2', nullable: true })
  limitType2: number; // удаагаар цагаар

  @Column({
    type: 'enum',
    enum: TimePeriod,
    nullable: true,
  })
  public frequency: TimePeriod; // Давтамж

  @Column({ name: 'is_enter_permission_hierarchy', default: false })
  isEnterPermissionHierarchy: boolean; // зөвшөөрлийн шатлалыг оруулна уу

  @Column({ type: 'jsonb', nullable: true })
  public hierarchy: HierarchyDto[]; // зөвшөөрлийн шатлал

  @Column({ name: 'is_time_and_day_limits', default: false })
  isTimeAndDayLimits: boolean; // илүү их цаг, өдрийн хязгаарлалт оруулна уу

  @Column({ name: 'is_work_vacation', default: false })
  isWorkVacation: boolean; // Амралтаар ажиллсан үед цайны цаг тооцох

  @Column({ type: 'jsonb', nullable: true })
  public vacation: HierarchyDto[]; // Амралтаар ажиллсан үед цайны цаг тооцох

  @OneToMany(
    () => TimeRequest,
    (timeRequest: TimeRequest) => timeRequest.timeState,
  )
  timeRequest?: TimeRequest[];
}
