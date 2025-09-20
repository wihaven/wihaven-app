import { AppLayout } from '~/widgets/app-layout';

import { DistributionForm } from './distribution-form';
import { DistributionReplaceConfirmation } from './distribution-replace-confirmation';

export const DistributionPage = () => {
    return (
        <AppLayout title="Делёжка">
            <DistributionForm />
            <DistributionReplaceConfirmation />
        </AppLayout>
    );
};
