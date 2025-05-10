import { IDPType } from '../../models/enums/idpType.enum';
import { IDPVerifier } from './idpVerifier.interface';
import { GoogleVerifier } from './google.strategy';
import { FacebookVerifier } from './facebook.strategy';
import { CognitoVerifier } from './cognito.strategy';

export class IDPVerifierFactory {
  static getVerifier(idpType: IDPType): IDPVerifier {
    switch (idpType) {
      case IDPType.GOOGLE:
        return new GoogleVerifier();
      case IDPType.FACEBOOK:
        return new FacebookVerifier();
      case IDPType.COGNITO:
        return new CognitoVerifier();
      default:
        throw new Error(`Unsupported IDP type: ${idpType}`);
    }
  }
}
