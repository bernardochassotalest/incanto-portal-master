import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid';
import { md5, sizedField, leftString } from '../../lib/utils'

const leftData = (object, key, length) => {
    return _.join(_.slice(_.get(object, key, ''), 0, length), '');
}

export const globalCustomer = async ({ postgres, logger, content, reference }) => {
    try {
        let found = await postgres.Customer.byVatNumber(content.vatNumber),
            customerId = uuidv4();

        content['name'] = leftData(content, 'name', 200);
        content['vatNumber'] = leftData(content, 'vatNumber', 20);
        content['email'] = leftData(content, 'email', 200);
        content['phone'] = leftData(content, 'phone', 20);
        content['birthDate'] = leftData(content, 'birthDate', 10);
        content['street'] = leftData(content, 'street', 200);
        content['streetNo'] = leftData(content, 'streetNo', 100);
        content['complement'] = leftData(content, 'complement', 100);
        content['neighborhood'] = leftData(content, 'neighborhood', 100);
        content['zipCode'] = leftData(content, 'zipCode', 10);
        content['city'] = leftData(content, 'city', 100);
        content['state'] = leftData(content, 'state', 2);
        content['country'] = leftData(content, 'country', 50);

        if (found) {
          let model = {
              name: content.name || found.name,
              vatNumber: content.vatNumber || found.vatNumber,
              email: content.email || found.email,
              phone: content.phone || found.phone,
              birthDate: content.birthDate || found.birthDate,
              street: content.street || found.street,
              streetNo: content.streetNo || found.streetNo,
              complement: content.complement || found.complement,
              neighborhood: content.neighborhood || found.neighborhood,
              zipCode: content.zipCode || found.zipCode,
              city: content.city || found.city,
              state: content.state || found.state,
              country: content.country || found.country,
            };
          customerId = found.id;
          await postgres.Customer.update(model, { where: { id: customerId }});
        } else {
          _.set(content, 'id', customerId);
          await postgres.Customer.create(content);
        }
        reference['customerId'] = customerId;
        await postgres.CustomerReference.upsert(reference);
    } catch(err) {
        logger(`Error: ${err} - ${JSON.stringify(content)} - ${JSON.stringify(reference)}`);
        return false;
    }
    return true;
}
