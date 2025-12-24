import { Radio, Github, Twitter, Mail, Heart } from "lucide-react"

export function Footer() {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        product: [
            { name: "Features", href: "#features" },
            { name: "Mosques", href: "#mosques" },
            { name: "Live Lectures", href: "#live-lectures" },
            { name: "Prayer Times", href: "#prayer-times" },
            { name: "Live Radio", href: "#live" },
        ],
        company: [
            { name: "About", href: "#about" },
            { name: "Blog", href: "#blog" },
            { name: "Careers", href: "#careers" },
            { name: "Contact", href: "#contact" },
        ],

    }

    const socialLinks = [
        { name: "Twitter", href: "#", icon: Twitter },

        { name: "Email", href: "mailto:hello@minaret.app", icon: Mail },
    ]

    return (
        <footer className="border-t bg-muted/30">
            <div className="container mx-auto px-4 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Radio className="h-6 w-6 text-primary" />
                            <span className="text-xl font-heading font-bold">Minaret</span>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-xs mb-6">
                            Your mosque community hub. Listen to live lectures, prayers, find mosques, and connect with your community.
                        </p>
                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="h-9 w-9 flex items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                                    aria-label={social.name}
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-heading font-semibold mb-4">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-heading font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>


                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-border/50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">
                            © {currentYear} Minaret. All rights reserved.
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            Made with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> for the Ummah
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
