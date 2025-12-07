import { Head, router } from '@inertiajs/react';
import WelcomeLayout from '@/layouts/welcome-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  CheckCircle2,
  Mail,
  Phone,
  Home,
  ArrowRight,
  GraduationCap,
  Clock,
  Users,
} from 'lucide-react';
import { search as searchTeachers } from '@/routes/teachers';
import { home as welcomeHome } from '@/routes';
import {
  FadeIn,
  StaggerContainer,
} from '@/components/animations';
import { useOptimizedAnimations } from '@/hooks/use-optimized-animations';
import { PageTransition } from '@/components/animations';

export default function RequestThankYou() {
  const { animationVariants, isInView } = useOptimizedAnimations();

  return (
    <PageTransition>
      <WelcomeLayout title="Demande envoyée">
        <Head title="Demande envoyée - Timmi" />

        <div className="relative min-h-screen overflow-hidden">
          <section className="relative flex min-h-[80vh] items-center justify-center m-0 p-0">
            <StaggerContainer
            className="w-full max-w-5xl"
            variants={animationVariants.containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            staggerDelay={0.1}
            >
            <FadeIn variants={animationVariants.itemVariants}>
                <Card className="shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-3xl">Demande envoyée avec succès !</CardTitle>
                    <CardDescription className="mt-2 text-base">
                    Merci pour votre confiance. Nous avons bien reçu votre demande.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Informations complémentaires */}
                    <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Prochaines étapes :</h3>
                    
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 rounded-lg border bg-muted/50 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold">Délai de traitement</h4>
                            <p className="text-sm text-muted-foreground">
                            Nous traiterons votre demande dans les 24 à 48 heures. Vous recevrez un email de confirmation dès qu'un professeur correspondant à vos critères sera disponible.
                            </p>
                        </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-lg border bg-muted/50 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold">Vérifiez votre boîte email</h4>
                            <p className="text-sm text-muted-foreground">
                            Un email de confirmation a été envoyé à l'adresse que vous avez fournie. Veuillez vérifier votre boîte de réception (et vos spams) pour plus d'informations.
                            </p>
                        </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-lg border bg-muted/50 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold">Mise en relation</h4>
                            <p className="text-sm text-muted-foreground">
                            Dès qu'un professeur correspondant à vos critères sera disponible, nous vous contacterons pour organiser la mise en relation et discuter des modalités.
                            </p>
                        </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-lg border bg-muted/50 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold">Besoin d'aide ?</h4>
                            <p className="text-sm text-muted-foreground">
                            Si vous avez des questions ou besoin d'informations complémentaires, n'hésitez pas à nous contacter. Notre équipe est à votre disposition pour vous accompagner.
                            </p>
                        </div>
                        </div>
                    </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.visit(welcomeHome().url)}
                    >
                        <Home className="h-4 w-4 mr-2" />
                        Retour à l'accueil
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={() => router.visit(searchTeachers().url)}
                    >
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Rechercher un autre professeur
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    </div>
                </CardContent>
                </Card>
            </FadeIn>
            </StaggerContainer>
          </section>
        </div>
      </WelcomeLayout>
    </PageTransition>
  );
}

