import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ContactDto } from '../../../client/infrastructure/rest/dtos/contact.dto';
import { RentEntity } from '../../infrastructure/persistence/entity/rent.entity';

@Injectable()
export class NodeMailerService {
  constructor(private readonly mailerService: MailerService) {}

  sendRentConfirmation(rent: RentEntity) {
    const originOffice = rent.originOffice;
    const destiny = rent.destinyOffice;
    this.mailerService
      .sendMail({
        to: rent.renterUser.email,
        subject: 'Confirmación de Reserva',
        template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          name: rent.renterUser.name,
          reference: rent.reference,
          vehicle: rent.rentedVehicle.fullName,
          origin: `${originOffice.address},${originOffice.zipCode}, ${originOffice.municipality.name}, ${originOffice.municipality.city.name}`,
          destiny: `${destiny.address},${destiny.zipCode}, ${destiny.municipality.name}, ${destiny.municipality.city.name}`,
          total: rent.total,
          dates: `${rent.startDate}-${rent.startHour} / ${rent.endDate}-${rent.endHour}`,
          link: `http://localhost:5000/api/rent-car/download/${rent.reference}`,
        },
      })
      .catch(console.error);
  }

  sendContactEmail(contactDto: ContactDto) {
    this.mailerService
      .sendMail({
        to: 'info@drakars.es',
        subject: `Contacto desde la Web`,
        template: 'contact',
        context: {
          name: contactDto.name,
          email: contactDto.email,
          phone: contactDto.phone,
          message: contactDto.message,
        },
      })
      .catch(console.error);
  }
}
