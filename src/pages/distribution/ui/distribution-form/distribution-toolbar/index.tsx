import clsx from 'clsx';

import styles from './distribution-toolbar.module.scss';
import { ResetDistribution } from './reset';
import { SaveDistribution } from './save';

export type DistributionToolbarProps = {
    className?: string;
};

export const DistributionToolbar = ({ className }: DistributionToolbarProps) => {
    return (
        <nav className={clsx(styles.root, className)}>
            <SaveDistribution />
            <ResetDistribution />
        </nav>
    );
};
