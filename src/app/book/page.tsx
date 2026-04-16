import BookingCalendar from "@/components/BookingCalendar";

export const metadata = {
  title: "Book — Ashbraids",
  description:
    "Check live availability and book your next appointment with Ashbraids.",
};

export default function BookPage({
  searchParams,
}: {
  searchParams: { service?: string };
}) {
  return (
    <>
      <section className="bg-sand">
        <div className="container-x py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-caramel">
            Book online
          </p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">
            Check availability.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-espresso/75">
            Pick a day, pick a time, pick a style. The chair opens at 10:30 AM
            and the last appointment starts by 7:00 PM.
          </p>
        </div>
      </section>
      <section className="container-x py-14">
        <BookingCalendar initialServiceId={searchParams.service} />
      </section>
    </>
  );
}
