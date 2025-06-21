import createNextIntlPlugin from 'next-intl/plugin';

import type {NextConfig} from 'next';

const nextConfig: NextConfig = {};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
