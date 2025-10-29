import { MapPin, Phone, Mail } from "lucide-react"
import { CardContent } from "@/components/ui/card"

export function CampusInfo() {
  const campuses = [
    {
      name: "Irvine Campus 校区",
      address: "5430 Trabuco Road, Irvine CA 92620",
      addressChinese: "地址：5430 Trabuco Road, Irvine CA 92620",
      phones: ["949-400-0837", "626-607-6798"],
      email: "tjtvtanye@126.com",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3322.8!2d-117.7!3d33.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDQyJzAwLjAiTiAxMTfCsDQyJzAwLjAiVw!5e0!3m2!1sen!2sus!4v1234567890",
    },
    {
      name: "Yorba Linda Campus 校区",
      address: "5100 E La Palma Ave, Suite 101, Anaheim CA 92807",
      addressChinese: "地址：5100 E La Palma Ave, Suite 101, Anaheim CA 92807",
      phones: ["714-592-5018", "657-387-1027"],
      email: "kathyj19720330@gmail.com",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.5!2d-117.8!3d33.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDQ4JzAwLjAiTiAxMTfCsDQ4JzAwLjAiVw!5e0!3m2!1sen!2sus!4v1234567890",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {campuses.map((campus, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-amber-500 text-white p-6">
                <h3 className="text-2xl font-bold">{campus.name}</h3>
              </div>

              <CardContent className="p-8 space-y-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-amber-700 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Address 地址：</p>
                    <p className="text-gray-700">{campus.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-amber-700 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Phone 联系电话：</p>
                    <p className="text-gray-700">{campus.phones.join(", ")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-amber-700 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Email 邮箱：</p>
                    <a
                      href={`mailto:${campus.email}`}
                      className="text-amber-700 hover:text-amber-800 hover:underline break-all"
                    >
                      {campus.email}
                    </a>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="font-semibold text-gray-900 mb-3">Map 地图：</p>
                  <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={campus.mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${campus.name} Map`}
                    />
                  </div>
                </div>
              </CardContent>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
