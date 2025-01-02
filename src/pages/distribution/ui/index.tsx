import { AppLayout } from '~/widgets/app-layout';
import { DistributionForm } from '~/widgets/distribution-form';

export const DistributionPage = () => {
    return (
        <AppLayout title="Делёжка">
            <DistributionForm />
        </AppLayout>
    );
};
