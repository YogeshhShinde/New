import { PartialType } from '@nestjs/swagger'; // Or @nestjs/mapped-types if swagger not installed
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) { }
