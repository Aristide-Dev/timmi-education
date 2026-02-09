import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { dashboard } from '@/routes';

const DAYS: { key: string; label: string }[] = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
  { key: 'saturday', label: 'Samedi' },
  { key: 'sunday', label: 'Dimanche' },
];

export type TimeSlot = { start: string; end: string };
export type AvailabilityState = Record<string, TimeSlot[]>;

const TEACHER_PROFILE_URL = '/teacher/profile';
const TEACHER_AVAILABILITY_EDIT_URL = '/teacher/availability/edit';
const TEACHER_AVAILABILITY_UPDATE_URL = '/teacher/availability';

interface Props {
  teacher: User;
  availability: AvailabilityState;
}

export default function TeacherAvailabilityEdit({ availability }: Props) {
  const initialAvailability: AvailabilityState = {};
  DAYS.forEach((d) => {
    initialAvailability[d.key] = (availability[d.key] || []).map((s) => ({
      start: s.start?.length === 5 ? s.start : (s.start || '09:00').slice(0, 5),
      end: s.end?.length === 5 ? s.end : (s.end || '17:00').slice(0, 5),
    }));
  });

  const form = useForm({
    availability: initialAvailability,
  });

  const addSlot = (dayKey: string) => {
    const slots = form.data.availability[dayKey] || [];
    form.setData('availability', {
      ...form.data.availability,
      [dayKey]: [...slots, { start: '09:00', end: '17:00' }],
    });
  };

  const removeSlot = (dayKey: string, index: number) => {
    const slots = form.data.availability[dayKey] || [];
    form.setData('availability', {
      ...form.data.availability,
      [dayKey]: slots.filter((_, i) => i !== index),
    });
  };

  const updateSlot = (dayKey: string, index: number, field: 'start' | 'end', value: string) => {
    const slots = [...(form.data.availability[dayKey] || [])];
    if (!slots[index]) return;
    slots[index] = { ...slots[index], [field]: value };
    form.setData('availability', {
      ...form.data.availability,
      [dayKey]: slots,
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: dashboard().url },
    { title: 'Mon profil', href: TEACHER_PROFILE_URL },
    { title: 'Mes créneaux', href: TEACHER_AVAILABILITY_EDIT_URL },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Mes créneaux - Disponibilités" />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Mes créneaux
          </h1>
          <p className="text-muted-foreground mt-2">
            Définissez les jours et horaires où vous êtes disponible pour les cours
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.visit(TEACHER_PROFILE_URL)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au profil
        </Button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.put(TEACHER_AVAILABILITY_UPDATE_URL, {
            preserveScroll: true,
          });
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Horaires par jour</CardTitle>
            <CardDescription>
              Ajoutez un ou plusieurs créneaux pour chaque jour. Laissez vide si vous n'êtes pas disponible ce jour-là.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {DAYS.map(({ key, label }) => {
              const slots = form.data.availability[key] || [];
              return (
                <div key={key} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">{label}</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSlot(key)}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Créneau
                    </Button>
                  </div>
                  {slots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aucun créneau. Cliquez sur &quot;Créneau&quot; pour ajouter des horaires.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {slots.map((slot, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 flex-wrap"
                        >
                          <input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateSlot(key, index, 'start', e.target.value)}
                            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                          />
                          <span className="text-muted-foreground">à</span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateSlot(key, index, 'end', e.target.value)}
                            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSlot(key, index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.visit(TEACHER_PROFILE_URL)}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={form.processing}>
            {form.processing ? 'Enregistrement…' : 'Enregistrer mes créneaux'}
          </Button>
        </div>
      </form>
    </AppLayout>
  );
}
