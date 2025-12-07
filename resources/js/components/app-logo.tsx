import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square h-10 w-full items-center justify-center rounded-md text-sidebar-primary-foreground">
                <AppLogoIcon className="h-full w-full max-w-23 fill-current text-white dark:text-black" />
            </div>
            {/* <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Laravel Starter Kit
                </span>
            </div> */}
        </>
    );
}
