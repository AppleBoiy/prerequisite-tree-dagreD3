const raw_data = [
    {
        "abbr": "CS111",
        "parent": [],
        "children": ["204114"],
        "code": "204111",
        "credit": 3,
        "full Name": "Fundamentals of Programming",
        "year": 1,
        "term": 1
    },
    {
        "code": "206183",
        "parent": [],
        "children": ["204451"],
        "credit": 3,
        "full Name": "Discrete Structure",
        "year": 1,
        "abbr": "Math183",
        "term": 1
    },
    {
        "code": "204114",
        "parent": ["204111"],
        "children": ["204203", "204212", "204231", "204232", "204252"],
        "credit": 3,
        "full Name": "Introduction to Object-oriented Programming",
        "year": 1,
        "abbr": "CS114",
        "term": 2
    },
    {
        "code": "204203",
        "parent": ["204114"],
        "children": [],
        "credit": 3,
        "full Name": "Computer Science Technology",
        "year": 2,
        "abbr": "CS203",
        "term": 1
    },
    {
        "code": "204212",
        "parent": ["204114"],
        "children": ["204315", "204361"],
        "credit": 3,
        "full Name": "Modern Application Development",
        "year": 2,
        "abbr": "CS212",
        "term": 2
    },
    {
        "code": "204231",
        "parent": ["204114"],
        "children": ["204341"],
        "credit": 3,
        "full Name": "Computer Organization and Architecture",
        "year": 2,
        "abbr": "CS231",
        "term": 1
    },
    {
        "code": "204232",
        "parent": ["204114"],
        "children": ["204390"],
        "credit": 3,
        "full Name": "Computer Networks and Protocols",
        "year": 2,
        "abbr": "CS232",
        "term": 2
    },
    {
        "code": "204252",
        "parent": ["204114"],
        "children": ["204271", "204321", "204451"],
        "credit": 3,
        "full Name": "Data Structures and Analysis",
        "year": 2,
        "abbr": "CS252",
        "term": 1
    },
    {
        "code": "208269",
        "parent": [],
        "children": ["204271"],
        "credit": 3,
        "full Name": "Statistics for Computer Science",
        "year": 2,
        "abbr": "Stat269",
        "term": 1
    },
    {
        // special characters
        "code": "204271",
        "parent": ["204252", "208269"],
        "children": [],
        "credit": 3,
        "full Name": "Introduction to Artificial Intelligence",
        "year": 2,
        "abbr": "CS271",
        "term": 2
    },
    {
        "code": "204306",
        "parent": [],
        "children": [],
        "credit": 1,
        "full Name": "Ethics for Computer Professionals",
        "year": 3,
        "abbr": "CS306",
        "term": 2,
        "conditions": "Third year standing"
    },
    {
        "code": "204315",
        "parent": ["204212"],
        "children": [],
        "credit": 3,
        "full Name": "Organization of Programming Languages",
        "year": 3,
        "abbr": "CS315",
        "term": 2
    },
    {
        "code": "204321",
        "parent": ["204251"],
        "children": [],
        "credit": 3,
        "full Name": "Database Systems",
        "year": 3,
        "abbr": "CS321",
        "term": 1
    },
    {
        "code": "204341",
        "parent": ["204231"],
        "children": ["204390"],
        "credit": 3,
        "full Name": "Operating Systems",
        "year": 3,
        "abbr": "CS341",
        "term": 1
    },
    {
        "code": "204361",
        "parent": ["204212"],
        "children": ["204390"],
        "credit": 3,
        "full Name": "Software Engineering",
        "year": 3,
        "abbr": "CS361",
        "term": 1
    },
    {
        // special characters
        "code": "204451",
        "parent": ["204251", ["206183", "206281"]],
        "children": [],
        "credit": 3,
        "full Name": "Algorithm Design and Analysis",
        "year": 3,
        "abbr": "CS451",
        "term": 1
    },
    {
        "code": "204490",
        "parent": [],
        "children": [],
        "credit": 3,
        "full Name": "Research in Computer Science",
        "year": 3,
        "abbr": "CS490",
        "term": 2,
        "conditions": "Consent of the department"
    },
    {
        "code": "204390",
        "parent": ["204232", "204321", "204341", "204361"],
        "children": [],
        "credit": 1,
        "full Name": "Computer Job Training",
        "year": 4,
        "abbr": "CS390",
        "term": 1
    },
    {
        "code": "204496",
        "parent": [],
        "children": [],
        "credit": 6,
        "full Name": "Cooperative Education",
        "year": 4,
        "abbr": "CS496",
        "term": 1,
        "conditions": "Fourth year standing and Consent of the department"
    },
    {
        "code": "204497",
        "parent": [],
        "children": [],
        "credit": 1,
        "full Name": "Seminar in Computer Science",
        "year": 4,
        "abbr": "CS497",
        "term": 2,
        "conditions": "Consent of the department"
    }
]

const rectTag = document.getElementsByTagName("rect");
const textTagArray = document.getElementsByTagName("text");

let course = {};

// create dictionary that abbr is key
raw_data.forEach(
    (e) => {
        course[e.abbr] = e;
    }
)

// filter to get only text tag that contains label tag and store to course dictionary
for (const textTag of textTagArray) {
    if (textTag.parentNode.classList[0] !== "label") {
        let abbr = textTag.childNodes[0]?.innerHTML;
        course[abbr]["innerText"] = textTag;
    }
}

// get node rect
for (const rect of rectTag) {

    // temp var to rest old style
    const oldBG = rect.style.fill;
    const oldBorder = rect.style.stroke;

    //on hover style
    const hoverBg = "#ff9752";
    const hoverBorder = "#333";

    rect.addEventListener("mouseenter", () => {
        rect.style.fill = hoverBg;
        rect.style.stroke = hoverBorder;

    })

    rect.addEventListener("mouseleave", () => {
        rect.style.fill = oldBG;
        rect.style.stroke = oldBorder;
    })

    const abbr = rect.parentNode.id;
    course[abbr]["rectTag"] = rect;


}

for (const abbr in course) {
    const text = `${course[abbr].abbr} : ${
        course[abbr].parent.length > 0? course[abbr].parent: course[abbr].conditions
    }`
    console.log(text)
}